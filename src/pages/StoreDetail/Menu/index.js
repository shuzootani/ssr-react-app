import React, { useState, useRef, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'
import {
  MenuContainer,
  ProductCategoryTabs,
  Tab,
  ProductList,
  CategoryLabelContainer,
  CategoryIcon,
  CategoryLabel,
  ProductOrderSheet,
  ProductSheetImage,
  FooterButtonContainer,
  AddProductButton
} from './styled'
import { productCategories as productCategoriesQuery } from '../../../graphql/queries'
import { formatPrice } from '../../../utils/formatter'
import Modal from '../../../components/Modal'
import FooterButton from '../../../components/FooterButton'
import { BasketContext } from '../../../providers/BasketContextProvider'
import { FormattedMessage } from 'react-intl'
import ProductItem from './ProductItem'

function Menu ({ storeId, history }) {
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState()
  const sectionRefs = useRef([])
  const categoryRefs = useRef([])

  const { addProduct, basket, amount, total } = useContext(BasketContext)

  function onClickCategoryTab (index) {
    categoryRefs.current[index].scrollIntoView({
      inline: 'center',
      block: 'nearest'
    })
    sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' })
    setTabIndex(index)
  }

  function decrement () {
    if (productCount === 1) return false
    setProductCount(count => count - 1)
  }

  function increment () {
    setProductCount(count => count + 1)
  }

  return (
    <Query
      query={productCategoriesQuery}
      variables={{ id: storeId }}
      fetchPolicy={'cache-and-network'}
    >
      {({ data, loading, error }) => {
        // console.log({ products: data })
        // console.warn({ error })
        const { productCategories } = data && data
        return (
          <MenuContainer>
            <ProductCategoryTabs>
              {productCategories &&
                productCategories.map((category, index) => (
                  <Tab
                    key={category.name}
                    ref={ref => (categoryRefs.current[index] = ref)}
                    active={tabIndex === index}
                    onClick={() => onClickCategoryTab(index)}
                  >
                    {category.name}
                  </Tab>
                ))}
            </ProductCategoryTabs>

            <ProductList>
              {productCategories &&
                productCategories.map((category, index) => (
                  <React.Fragment key={category.name}>
                    <CategoryLabelContainer
                      ref={ref => (sectionRefs.current[index] = ref)}
                    >
                      <CategoryIcon src={category.icon} />
                      <CategoryLabel>{category.name}</CategoryLabel>
                    </CategoryLabelContainer>
                    {category.products.map(product => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        selectedProduct={selectedProduct}
                        onClick={setSelectedProduct}
                        addToBasket={addProduct}
                      />
                    ))}
                  </React.Fragment>
                ))}
            </ProductList>

            {amount > 0 && (
              <FooterButton onClick={() => history.push('/checkout')}>
                <FooterButtonContainer>
                  <div>{amount}</div>
                  <div>ZUM WARENKORB</div>
                  <div>{formatPrice(total)}</div>
                </FooterButtonContainer>
              </FooterButton>
            )}
          </MenuContainer>
        )
      }}
    </Query>
  )
}

export default withRouter(Menu)
