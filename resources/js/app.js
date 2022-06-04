import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'
let addToCart=document.querySelectorAll('.add-to-cart')
let cardCounter=document.querySelector('#cartCounter')

function updateCart(pizza){
    axios.post('/update-cart',pizza).then(function(res){
        cardCounter.innerText=res.data.totalQty
        new Noty({
            type:'success',
            timeout:1000,
            text: "Item added to cart",
            progressBar:false
          }).show();
    }).catch(err=>{
        new Noty({
            type:'error',
            timeout:1000,
            text: "something went wrong",
            progressBar:false
          }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let pizza=JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

const alertMsg=document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}

initAdmin()