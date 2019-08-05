import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, EmptyStateCard, unselectable } from '@aragon/ui'
import icon from '../../assets/empty-ab.svg'

const Icon = () => <img src={icon} alt="Empty entities icon" />

const Empty = ({ action }) => (
  <EmptyWrapper>
    <EmptyStateCard
      title="You have not added anyone  to the address book."
      text="Get started now by adding a new entity."
      illustration={<Icon />}
      actionText="New Entity"
      action={
        <Button onClick={action}>New Entity</Button>
      }
    />
  </EmptyWrapper>
)

Empty.propTypes = {
  action: PropTypes.func.isRequired,
}

const EmptyWrapper = styled.div`
  ${unselectable};
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default Empty

