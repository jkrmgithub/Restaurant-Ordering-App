import { menuArray } from './data.js'

// IMPORT UUID GENERATOR CDN:
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// IMPORT LODASH LIBRARY FOR DEEP COPIES
// import _ from "lodash"


// RENDER THE MENU:
document.getElementById('menu').innerHTML = renderMenu()

let toBeOrdered = ''
let toBeDeleted = '' // saving the data attribute for later

document.addEventListener('click',function(e){
    if (e.target.dataset.btn){
        toBeOrdered = e.target.dataset.btn
        document.getElementById('order-heading').classList.remove('hidden')
        document.getElementById('complete-order-btn').classList.remove('hidden')
        getFoodItem()
        console.log(e.target.id)
        if (orderList.length > 0){
            renderOrder()
            renderTotalPrice()
        }
    }
    else if(e.target.dataset.remove){
        toBeDeleted = e.target.dataset.remove
        removeItem()
    }
    else if(e.target.id === 'complete-order-btn'){
        completeOrder()
    }
    else if(e.target.id === 'pay-btn'){
        renderThankYouMessage()
    }
    else if(e.target.id === 'order-again-btn'){
        location.reload()
    }
})

let orderList = []

function getFoodItem(){
    menuArray.forEach(function(item){
        if (item.id.toString() === toBeOrdered){
            
            // BUG IS HERE!!! -- BUG *WAS* HERE
            
            // I need to add a unique UUID for each order item!
            let newUuid = uuidv4() // generate a new UUID
            let newOrder = {...item} // new variable for the new order // 
            
            // EXPLAINING THE BUG:
            // deep copies needed, I setteled for 'deep' copy using the spread operator. The code below doesn't work:
            // let newOrder = item (All of the same items of food will have the same uuid (e.g., all hamburgers will have the same uuid. Each iteration would change the uuid, but they would all have teh same one.))
            
            newOrder.uuid = newUuid
            orderList.push(newOrder)
            console.log(orderList)
            
            // BUG IS HERE!!!
        }
    })
}

// CHANGE MADE IN LINE 52

function makeOrderListHtml(){
    let orderListHtml = ``
    orderList.forEach(function(order){
        orderListHtml += `
        <div class="order-list">
            <div class="order">
                <div>${order.name}</div>
                <button class="remove-btn" data-remove="${order.uuid}">REMOVE</button> 
                <div class="order-price">£${order.price}</div>
            </div>
        </div>
        `
    })
    return orderListHtml
}


function getTotalPrice(){
    let totalPrice = 0
    orderList.forEach(function(order){
        totalPrice += order.price
    })
    return totalPrice
}

function removeItem(){
    orderList.forEach(function(order){
        if (order.uuid === toBeDeleted){
            // console.log("It's working! Yay!!!! 🥳")
            orderList.splice(orderList.indexOf(order), 1)
        }
    })
    renderOrder()
    renderTotalPrice()
}

function completeOrder(){
    if (orderList.length > 0){
            document.getElementById('payment-modal').classList.remove('hidden') // show modal
            document.querySelectorAll('.add-btn-container button').forEach(function(button){
                button.disabled = true // disabled the button
            })
            renderMenu()
    }
    else {
        console.log("You can't order 0 items!")
        document.getElementById('warning-message').classList.remove('hidden')
    }

}

function paymentComplete(){
    let customerName = document.getElementById('customerName').value
    let thankYouMessageHtml = `
        <div class="thanks-message">
            <h2>Thank you, ${customerName}! Your order is on its way!</h2>
        </div>
        <div>
            <button class="order-again-btn" id="order-again-btn">Order again?</button>
        </div>
    `
    return thankYouMessageHtml
}

function renderThankYouMessage(){
    document.getElementById('main').innerHTML = paymentComplete()
    document.getElementById('main').classList.add('thank-you-message')
}

function renderTotalPrice(){
    document.getElementById('orderTotal').innerHTML = `
    <div class="total-container">
        <div class="total">Total:   £${getTotalPrice()}</div>
    </div>
    `
}

function renderOrder(){
    document.getElementById('order-list').innerHTML = makeOrderListHtml()
}

function renderMenu(){
        let menuList = ``
        menuArray.forEach(function(food){
        menuList += `
        <div class="menu-item">
            <div class="emoji">
                ${food.emoji}
            </div>
            <div class="text">
                <div>${food.name}</div>
                <div>${food.ingredients}</div>
                <div>£${food.price}</div>
            </div>
            <div class="add-btn-container">
                <button class="add-btn" id="add-btn" data-btn="${food.id}">+</button>
            </div>
        </div>
        `
    })
    return menuList
}



