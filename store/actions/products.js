import Product from "../../models/product"

export const DELETE_PRODUCT = "DELETE_PRODUCT"
export const CREATE_PRODUCT = "CREATE_PRODUCT"
export const UPDATE_PRODUCT = "UPDATE_PRODUCT"
export const SET_PRODUCTS = "SET_PRODUCTS"

export const fetchProducts = () => {
    return async (dispatch, getState) => {

        try{
            const userId = getState().auth.userId
            const response = await fetch("https://react-native-shop-87fbb-default-rtdb.firebaseio.com/products.json")

            if(!response.ok) {
                throw new Error('Something went wrong')
            }

            const resData = await response.json()

            const loadedProducts = []

            for(const key in resData) {
                const {title, imageUrl, description, price, ownerId} = resData[key]
                loadedProducts.push(new Product(key, ownerId, title, imageUrl, description, price))
            }

            dispatch({
                type: SET_PRODUCTS, 
                products: loadedProducts, 
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            })
        } catch(err) {
            throw err;
        }
    }
}

export const deleteProduct = productId => {

    return async (dispatch, getState) => {
        try{
            const token = getState().auth.token
            const response = await fetch(`https://react-native-shop-87fbb-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`, {
                method: 'DELETE'
            })

            if(!response.ok) {
                throw new Error('Something went wrong')
            }

            dispatch({
                type: DELETE_PRODUCT,
                pid: productId
            })
        } catch(err) {
            throw err;
        }
    }

    
}

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        
        try{
            const token = getState().auth.token
            const userId = getState().auth.userId
            const response = await fetch(`https://react-native-shop-87fbb-default-rtdb.firebaseio.com/products.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title, description, imageUrl, price, ownerId: userId
                })
            })
            if(!response.ok) {
                throw new Error('Something went wrong')
            }

            const resData = await response.json()

            dispatch({
                type: CREATE_PRODUCT,
                productData: {
                    id: resData.name,
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId
                }
            })

        } catch(err) {
            throw err;
        }
    }
}

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        
        try{
            const token = getState().auth.token
            const response = await fetch(`https://react-native-shop-87fbb-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title, description, imageUrl
                })
            })

            if(!response.ok) {
                throw new Error('Something went wrong')
            }

            dispatch({
                type: UPDATE_PRODUCT,
                pid: id,
                productData: {
                    title,
                    description,
                    imageUrl
                }
            })
        } catch(err) {
            throw err;
        }
    }
    
}