import React from 'react';
import ReactHtmlParser from 'react-html-parser'; 
import '../stylesheets/chat_message.css';

export class ChatMessage extends React.Component {
  constructor(props) {
    super(props);
    this.getMsgAlignClass = this.getMsgAlignClass.bind(this)
  }

  getMsgAlignClass(messageType){
    if(messageType != null && messageType != "Right"){
      return "chat-msg-lt";
    }else {
      return "chat-msg-rt";
    }
  }

  render() {
    return (
      <div>
        <div class={this.getMsgAlignClass(this.props.msgType)}>
          <div> { ReactHtmlParser (this.props.msg) } </div>

        </div>
      </div>
    );
  }
}


export default ChatMessage;