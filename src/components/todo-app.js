import { LitElement, html, css } from '../../node_modules/lit';
import { firebaseConfig } from '../../config.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

export class TodoApp extends LitElement {
  static get styles() {
    return css`
      h1 {
        color: #fff;
        font-size: 64px;
        letter-spacing: 2px;
        margin-top: 80px;
        text-align: center;
      }

      .content {
        background: #fff;
        max-width: 960px;
        margin: 30px auto;
        padding: 20px 30px;
        border-radius: 10px 120px 10px 10px;
        box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
      }

      ul {
        list-style-type: none;
        padding: 0;
      }

      li {
        padding: 20px;
        background: #f6f6f6;
        font-size: 20px;
        color: #555;
        position: relative;
        border-bottom: 1px solid #e6e6e6;
        height: 46px;
      }

      li:nth-child(even) {
        padding: 20px;
        background: #f2f2f2;
      }

      li span {
        display: block;
      }

      li span:nth-child(2) {
        font-size: 16px;
        margin-top: 6px;
        color: #999;
      }

      li div {
        position: absolute;
        top: 0;
        right: 0px;
        background: rgba(255, 255, 255, 0.6);
        width: 40px;
        text-align: center;
        padding: 10px 0;
        font-weight: bold;
        cursor: pointer;
      }

      form input {
        float: left;
        width: 78%;
        margin: 0;
        border: 0;
        border-bottom: 1px solid #eee;
        margin: 0 1%;
        padding: 10px;
        display: block;
        box-sizing: border-box;
        font-size: 18px;
      }

      form input:focus {
        outline: none;
        border-bottom: 3px solid #88236f;
        padding-bottom: 8px;
        transition: all ease 0.2s;
      }

      form:after {
        content: '';
        clear: both;
        display: block;
      }

      button {
        border: 0;
        background: #fff;
        border-radius: 10px;
        padding: 13px;
        width: 14%;
        box-shadow: -1px 0px 1px rgba(0, 0, 0, 0.1);
        font-weight: bold;
        font-family: ubuntu;
        letter-spacing: 1px;
        color: ivory;
        font-size: 20px;
        background: #88236f;
        float: right;
        margin-right: 50px;
        cursor: pointer;
      }
    `;
  }

  render() {
    return html`
      <div class="content">
        <form id="todo-form">
          <input type="text" name="list" placeholder="Type your Todo here" />
          <button>Add Todo</button>
        </form>

        <ul id="todo-list"></ul>
      </div>
    `;
  }

  firstUpdated() {
    this.todoList = this.shadowRoot.querySelector('#todo-list');
    this.form = this.shadowRoot.querySelector('#todo-form');

    // saving data
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      db.collection('Todo').add({
        list: this.form.list.value,
      });
      this.form.list.value = '';
    });

    // real-time listener
    db.collection('Todo').onSnapshot((snapshot) => {
      this.changes = snapshot.docChanges();
      this.changes.forEach((change) => {
        if (change.type == 'added') {
          this.renderTodo(change.doc);
        } else if (change.type == 'removed') {
          let li = this.todoList.querySelector(
            '[data-id=' + change.doc.id + ']'
          );
          this.todoList.removeChild(li);
        }
      });
    });
  }

  // create element & render todo
  renderTodo(doc) {
    this.li = document.createElement('li');
    this.list = document.createElement('span');
    this.cross = document.createElement('div');

    this.li.setAttribute('data-id', doc.id);
    this.list.textContent = doc.data().list;
    this.cross.textContent = 'X';

    this.li.appendChild(this.list);
    this.li.appendChild(this.cross);

    this.todoList.appendChild(this.li);

    //deleting data
    this.cross.addEventListener('click', (e) => {
      let id = e.target.parentElement.getAttribute('data-id');
      db.collection('Todo').doc(id).delete();
    });
  }
}

customElements.define('todo-app', TodoApp);
