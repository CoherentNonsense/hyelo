class Socket
{
  constructor(app)
  {
    this.app = app;
    this.ws = null;
  }

  connect()
  {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    this.ws = new WebSocket(`${protocol}//${location.host}`);
    this.ws.onopen = () => {
      this.app.onLoad(window.location.search.replace(/^\?/, ''));
    };
  
    this.ws.onclose = (e) => {
      setTimeout(() => {
        this.connect();
      }, 2000);
    };
  
    this.ws.onmessage = (e) => {
      this.app.messageManager.push(JSON.parse(e.data));
    };
  }

  emit(data)
  {
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
    {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export default Socket;
