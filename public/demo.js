window.addEventListener("DOMContentLoaded", () => { 
    const objUrlParams = new URLSearchParams(window.location.search)
    const page = objUrlParams.get('page')||1

    Axios.get(`http://localhost:3501/user/get-expense?page=${page}`)
    .then((res)=>{
        listProducts(res.data.products)
        showPagination(res.data)

    })
    .catch(err=>{
        console.log(err)
    })
})

function listProducts(productsData){
    const productList = document.querySelector('#product-list')
    productList.innerHTML = ''

    productsData.forEach(product => {
        const productElement = document.createElement('div')
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>${product.price}</p>
        `
        productList.appendChild(productElement)
    })
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}){
    const pagination = document.querySelector('#pagination')
    pagination.innerHTML=''

    if(hasPreviousPage){
        const btn2= document.createElement('button')
        btn2.innerHTML=previousPage;
        btn2.addEventListener('click',()=>getProducts(previousPage))
        pagination.appendChild(btn2)
    }

    const btn1= document.createElement('button')
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener('click',()=>getProducts(currentPage))
    pagination.appendChild(btn1)

    if(nextPage){
        const btn3= document.createElement('button')
        btn3.innerHTML=nextPage;
        btn3.addEventListener('click',()=>getProducts(nextPage))
        pagination.appendChild(btn3)
    }
}

function getProducts(page){
    Axios.get(`http://localhost:3501/user/get-expense?page=${page}`)
    .then((res)=>{
        listProducts(res.data.products)
        showPagination(res.data)

    })
    .catch(err=>{
        console.log(err)
    })
}
