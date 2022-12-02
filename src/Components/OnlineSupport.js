import { useContext, useState } from 'react';
import { AccountContext } from './Account';
import {ChatMessage} from './ChatMessage';
import {Polling} from './Polling';
import React from 'react';
import '../stylesheets/online-support.css';

export class OnlineSupport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatHistory: [],
      inputMessage: "",
      lastMessage: ""
    }


    this.constructChatHistoryString = this.constructChatHistoryString.bind(this);
    this.onCustomerSubmit           = this.onCustomerSubmit.bind(this);
    this.handleInputChange          = this.handleInputChange.bind(this);
    this.getChatHistory             = this.getChatHistory.bind(this);
    this.myRef                      = React.createRef();
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.lastMessage != this.state.lastMessage){
      const lexLambdaUrl = "https://larmot3mqqmzyowyhr2ypsu3v40ognqp.lambda-url.us-east-1.on.aws"
      let customerLastMessage = this.state.lastMessage
      if(customerLastMessage != ''){
        var lexLambdaUrlWithQuery = lexLambdaUrl + "?msg=" + customerLastMessage + "&userid=" + window.localStorage.getItem("email")
        fetch(lexLambdaUrlWithQuery)
        .then(res => res.json())
        .then(
          (result) => {
            let msgStr = result
            if(msgStr.indexOf("[relative-link]") > -1 && msgStr.indexOf("[/relative-link]") > -1){
              //relative_url = """;
              var mySubString = msgStr.substring( msgStr.indexOf("[relative-link]") + 15, msgStr.lastIndexOf("[/relative-link]"));
              //need to go to chat url
              //window.location = mySubString
              //console.log(msgStr)
              // localStorage.setItem('CustomerType', 'CustomerCare');
              // localStorage.setItem('email', 'support@gmail.com');
              msgStr = msgStr.substring(0,msgStr.indexOf("[relative-link]")) + "<a href='" + mySubString + "'> Link </a>"
            }else if(msgStr.indexOf("[customer-complaint]") > -1 && msgStr.indexOf("[/customer-complaint]") > -1){
              var mySubString = msgStr.substring( msgStr.indexOf("[customer-complaint]") + 15, msgStr.lastIndexOf("[/customer-complaint]"));
              msgStr = msgStr.substring(msgStr.indexOf("[customer-complaint]") + 20 ,msgStr.indexOf("[/customer-complaint]")) + "<a href='/chat?email=" + localStorage.getItem("email") + "'> Link </a>"
              //window.location = ("/chat?email=" + localStorage.getItem("email"))
            }
            //console.log("*******" + msgStr)
            let tempArry = [...this.state.chatHistory]
            tempArry.push(<ChatMessage msg={msgStr} msgType="Left"/>)
            this.setState({chatHistory: tempArry, inputMessage: "", lastMessage: ""})
          },
          (error) => {
            console.log("error")
          }
        )
      }
    }
  }

  constructChatHistoryString(){
    var completeChatString = ""
    for(var i=0;i<this.state.chatHistory.length;i++){
      completeChatString += (<br/> + this.state.chatHistory[i])
    }
    return completeChatString;
  }

  onCustomerSubmit(){
    var customerInputText = this.state.inputMessage;
    if(customerInputText != null && customerInputText != ''){
      console.log(customerInputText)
      let tempArry = [...this.state.chatHistory]
      tempArry.push(<ChatMessage msg={customerInputText} msgType="Right"/>)
      console.log(tempArry)
      this.setState({chatHistory: tempArry, inputMessage: "", lastMessage: customerInputText})
    }
  }

  onCustomerKeyPress(event){
    if(event.which == 13){
      this.onCustomerSubmit();
    }
  }
  handleInputChange(event){
    this.setState({inputMessage: event.target.value})
  }

  getChatHistory(){
    var arr = new Array(this.state.chatHistory)
    for(let i = 0; i < arr.length / 2; i++){
       //Swap the elements
       [arr[i], arr[arr.length - i - 1]] = [arr[arr.length - i - 1], arr[i]];
    }
    return arr;
  }

  render() {
    return (
      <div class='chat-panel'>
        <div class='chat-window' ref={this.myRef}>
          {this.getChatHistory()}
        </div>
        <input class="chat-text-box" onChange={this.handleInputChange} onKeyPress={(e) => this.onCustomerKeyPress(e)} value={this.state.inputMessage}/>
        <button class = "chat-button" onClick={this.onCustomerSubmit}>Submit</button>
      </div>
    );
  }

  // componentDidMount(){
  //   this.myRef.current.scrollIntoView({ behavior: 'smooth' });
  // }

}

export default OnlineSupport;