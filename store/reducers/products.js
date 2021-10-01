import PRODUCTS from '../../data/dummy-data'
import Product from '../../models/product'
import { CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT } from '../actions/products'

const initialState = {
    availableProducts: PRODUCTS,
    userProducts: PRODUCTS.filter(product => product.ownerId === "u1" )
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_PRODUCTS:
            return {
                ...state,
                availableProducts: action.products,
                userProducts: action.products.filter(product => product.ownerId === "u1" )

            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(
                    product => product.id !== action.pid
                ),
                availableProducts: state.availableProducts.filter(
                    product => product.id !== action.pid
                )
            }
        case CREATE_PRODUCT:
            const {id, title, imageUrl, description, price} = action.productData
            const newProduct = new Product(id,
                                            'u1',
                                            title,
                                            imageUrl,
                                            description,
                                            +price)
                    
            return {
                ...state,
                availableProducts: [...state.availableProducts, newProduct],
                userProducts: state.userProducts.concat(newProduct)
            }
        case UPDATE_PRODUCT:
            const pid = action.pid
            const productIndex = state.userProducts
                                        .findIndex(prod => prod.id === pid)
            const updatedProduct =  new Product(pid,
                                                'u1',
                                                action.productData.title,
                                                action.productData.imageUrl,
                                                action.productData.description,
                                                state.userProducts[productIndex].price)

            const updatedUserProducts = [...state.userProducts]
            updatedUserProducts[productIndex] = updatedProduct

            const availableProductIndex = state.availableProducts
                                            .findIndex(prod => prod.id === pid)

            const updatedAvailableProducts = [...state.availableProducts]
            updatedAvailableProducts[availableProductIndex] = updatedProduct

            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            }
    }
    return state
}