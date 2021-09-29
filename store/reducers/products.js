import PRODUCTS from '../../data/dummy-data'
import Product from '../../models/product'
import { CREATE_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT } from '../actions/products'

const initialState = {
    availableProducts: PRODUCTS,
    userProducts: PRODUCTS.filter(product => product.ownerId === "u1" )
}

export default (state = initialState, action) => {
    switch(action.type) {
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
            const {title, imageUrl, description, price} = action.productData
            const newProduct = new Product(new Date().toString(),
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
            const id = action.pid
            const productIndex = state.userProducts
                                        .findIndex(prod => prod.id === id)
            const updatedProduct =  new Product(id,
                                                'u1',
                                                action.productData.title,
                                                action.productData.imageUrl,
                                                action.productData.description,
                                                state.userProducts[productIndex].price)

            const updatedUserProducts = [...state.userProducts]
            updatedUserProducts[productIndex] = updatedProduct

            const availableProductIndex = state.availableProducts
                                            .findIndex(prod => prod.id === id)

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