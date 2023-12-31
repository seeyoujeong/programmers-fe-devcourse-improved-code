import { Header, TodoForm, TodoList, TodoCount } from "./components";
import { createTarget } from "./service";
import { todoStorage, todosService } from "./domain";
import { TodoState } from "./types";

interface AppProps {
  $parent: HTMLBodyElement;
}

export default class App {
  $target: HTMLElement;
  state: TodoState[];
  todoList: TodoList;
  todoCount: TodoCount;

  constructor({ $parent }: AppProps) {
    this.$target = document.createElement("main");
    $parent.prepend(this.$target);

    this.state = todoStorage.getData();

    new Header({
      element: {
        $parent: this.$target,
        $target: createTarget("header"),
      },
      props: {
        title: "Todo List",
      },
    });
    new TodoForm({
      element: {
        $parent: this.$target,
        $target: createTarget("form", { class: "todo-form" }),
      },
      props: {
        addItem: (item: string) => {
          this.setState(todosService.addItem(this.state, item));
        },
      },
    });
    this.todoList = new TodoList({
      element: {
        $parent: this.$target,
        $target: createTarget("div", { class: "todo-list" }),
      },
      props: {
        initialState: this.state,
        toggleItem: (id: number) => {
          this.setState(todosService.toggleItem(this.state, id));
        },
        deleteItem: (id: number) => {
          this.setState(todosService.deleteItem(this.state, id));
        },
      },
    });
    this.todoCount = new TodoCount({
      element: {
        $parent: this.$target,
        $target: createTarget("div", { class: "todo-count" }),
      },
      props: {
        initialState: todosService.countItem(this.state),
      },
    });
  }

  setState(nextState: TodoState[]) {
    this.state = nextState;
    this.todoList.setState(this.state);
    this.todoCount.setState(todosService.countItem(this.state));
    todoStorage.setData(this.state);
  }
}
