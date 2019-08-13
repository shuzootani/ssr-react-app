import * as React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { storeQuery } from '../../graphql/queries'
import {
  StoreDetailContainer,
  StoreImageContainer,
  StoreImage,
  BottomButtonsContainer,
  StoreName,
  ImageOverlay,
  BottomContainer,
} from './styled'
import Menu from './Menu'
import StoreLocation from './StoreLocation'
import PickupTimeSelector from './PickupTimeSelector'

// storeId to test
// str_u1jrt15jbudc
// str_u1jrte2sudch
// str_u1jrtcx1zx81
function StoreDetail({ match: { params: { storeId = 'str_u1jrtcx1zx81' } } }) {
  const { data } = useQuery(storeQuery, { variables: { id: storeId }, fetchPolicy: 'cache-and-network' })
  return data && data.store ? (
    <StoreDetailContainer>
      <StoreImageContainer>
        <ImageOverlay />
        <StoreImage src={data.store.banner} />
        <BottomContainer>
          <StoreName>{data.store.name}</StoreName>
          <BottomButtonsContainer>
            <PickupTimeSelector {...data.store} />
            <StoreLocation {...data.store} />
          </BottomButtonsContainer>
        </BottomContainer>
      </StoreImageContainer>
      <Menu storeId={storeId} />
    </StoreDetailContainer>
  ) : null
}

StoreDetail.propTypes = {
  match: PropTypes.object.isRequired,
}

export default React.memo(StoreDetail)
