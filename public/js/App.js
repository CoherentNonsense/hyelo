import CommandManager from './CommandManager.js';
import MessageManager from './MessageManager.js';
import Socket from './Socket.js';
import { load } from './homepage.js';
import { loadSidebar, updateNick, updateTheme } from './sidebar.js';

class ChatApp
{
  constructor()
  {
    this.socket = new Socket(this);
    this.socket.connect();
    this.commandManager = new CommandManager(this);
    this.messageManager = new MessageManager(this);

    // logo link
    this.logoHTML = document.getElementById('logo');
    this.logoHTML.addEventListener('click', () => {
      this.changeRoute('homepage');
      this.commandManager.handle('home');
    });

    // router
    this.contentHTML = document.getElementById('content');
    this.routes = {
      homepage: document.getElementById('homepage-template').innerHTML,
      chatroom: document.getElementById('chatroom-template').innerHTML,
    }

    // session
    this.currentRoute = null;
    this.nick = null;
    this.room_open = false;
    this.in_random = false;
    this.room_id = null;

    this.changeNick("Stranger");
    loadSidebar(this);
  }

  changeRoute(route)
  {
    if (route === this.currentRoute)
    {
      return;
    }
    this.currentRoute = route;
    this.contentHTML.innerHTML = this.routes[this.currentRoute];
    if (route === 'homepage')
    {
      this.room_open = false;
      history.replaceState(null, null, '/');
      load(this);
    }
    else if (route === 'chatroom')
    {
      this.room_open = true;
      this.messageManager.onLoad();
    }
  }

  changeNick(new_nick)
  {
    if (!new_nick || new_nick.length < 1) {
      new_nick = "Stranger";
    }
    new_nick = new_nick.trim().substring(0, 20);
    this.nick = new_nick;
    if (new_nick === 'Stranger')
    {
      localStorage.removeItem('nick');
    }
    else
    {
      localStorage.setItem('nick', this.nick);
    }
    updateNick(this.nick);
  }

  changeTheme(new_theme)
  {
    updateTheme(new_theme);
  }

  onLoad(room_id)
  {
    if (!room_id)
    {
      this.changeRoute('homepage');
      history.replaceState(null, null, '/');
    }
    const new_nick = localStorage.getItem('nick') || 'Stranger';
    if (new_nick !== 'Stranger')
    {
      this.commandManager.handle('nickz', new_nick);
    }
    else
    {
      this.changeNick('Stranger');
    }
    this.commandManager.handle('join', room_id);
  }
}

export default ChatApp;

