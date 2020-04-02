import React, {Component} from "react"

class Main extends Component{
    constructor(props){
        super(props)
        this.state={
            output:"0"
        }
    }
    render(){
        return(
         <div>
             <form onSubmit={(event)=>{
                 event.preventDefault()
                 let etherAmount
                 etherAmount = this.input.value.toString()
                 etherAmount = window.web3.utils.toWei(etherAmount,"Ether")
                 this.props.buyTokens(etherAmount)
             }}>
                 <input
                 type="text"
                 onChange={(event)=>{
                     const etherAmount=this.input.value.toString()
                     this.setState({
                         output:etherAmount*100
                     })
                 }} ref={(input)=>{this.input = input}}
                 placeholder="0"
                 required/><br/>
                 Ether Balance:{window.web3.utils.fromWei(this.props.ethBalance,"Ether")}<br/>
                  <input
                  type="text"
                  placeholder="0"
                  value={this.state.output}
                  disabled/><br/> 
                Token Balance:{window.web3.utils.fromWei(this.props.tokenBalance,"Ether")};<br/>
                <button type="submit">buy</button><br/> 
             </form>
         </div>
           
        )
    }
}
export default Main;