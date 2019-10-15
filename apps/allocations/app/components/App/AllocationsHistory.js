import React from 'react'
import { useAppState } from '@aragon/api-react'
import {
  DataView,
  IconCheck,
  IconCross,
  IdentityBadge,
  ProgressBar,
  Text,
  useTheme,
} from '@aragon/ui'
import { BigNumber } from 'bignumber.js'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { STATUSES } from '../../utils/constants'
import { displayCurrency } from '../../utils/helpers'

const AllocationsHistory = ({ allocations }) => {
  const theme = useTheme()
  const { balances = [], budgets = [] } = useAppState()
  const getTokenSymbol = inputAddress => {
    const matchingBalance = balances.find(({ address }) => inputAddress === address)
    return matchingBalance ? matchingBalance.symbol : ''
  }
  const getBudgetName = inputId => {
    const matchingName = budgets.find(({ id }) => inputId === id)
    return matchingName ? matchingName.name : `# ${inputId}`
  }
  return (
    <DataView
      mode="adaptive"
      tableRowHeight={92}
      heading={
        <Text size="xlarge">Allocations history</Text>
      }
      fields={[
        'Date',
        'Budget',
        { label: 'Recipients', childStart: true },
        'Description',
        'Status',
        'Amount'
      ]}
      entries={allocations}
      renderEntry={({
        date,
        accountId,
        recipients,
        description,
        status,
        amount,
        token
      }, index) => {
        return [
          new Date(Number(date)).toLocaleDateString(),
          <div key={index}>
            {getBudgetName(accountId)}
          </div>,
          recipients.length === 1 ? '1 entity'
            : recipients.length + ' entities',
          description,
          <Status key={index} code={status} />,
          <Amount key={index} theme={theme} >
            { displayCurrency(BigNumber(-amount)) } { getTokenSymbol(token) }
          </Amount>
        ]
      }}
      renderEntryExpansion={({ recipients, amount, token }) => {
        const totalSupports = recipients.reduce((total, recipient) => {
          return total + Number(recipient.supports)
        }, 0)
        return recipients.map((recipient, index) => {
          const allocated = BigNumber(recipient.supports).div(totalSupports)
          return (
            <div key={index}>
              <IdentityBadge
                entity={recipient.candidateAddress}
              />
              <RecipientProgress theme={theme}>
                <ProgressBar
                  value={allocated.toNumber()}
                  color={String(theme.accentEnd)}
                />
              </RecipientProgress>
              <RecipientAmount theme={theme}>
                { displayCurrency(BigNumber(amount).times(allocated)) } {' '}
                {getTokenSymbol(token)} {' • '}
                { allocated.times(100).dp(0).toNumber() }{'%'}
              </RecipientAmount>
            </div>
          )
        })
      }}
    />
  )
}

AllocationsHistory.propTypes = {
  allocations: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const Status = ({ code }) => {
  const theme = useTheme()
  return (
    <StatusContent theme={theme} code={code}>
      { code === 1 && <IconCross size="medium" color={theme.negative} /> }
      { code > 1 && <IconCheck size="medium" color={theme.positive} /> }
      <StatusText>
        {STATUSES[code]}
      </StatusText>
    </StatusContent>
  )
}

Status.propTypes = {
  code: PropTypes.number.isRequired,
}

const Amount = styled.div`
  color: ${({ theme }) => theme.negative};
  font-weight: 600;
`

const RecipientProgress = styled.div`
   margin-top: 8px;
   margin-bottom: 4px;
   width: 100%;

   div {
     background: ${({ theme }) => theme.overlay};
   }
 `

const RecipientAmount = styled.div`
   color: ${({ theme }) => theme.contentSecondary};
   font-size: 12px;
   text-align: right;
 `

const StatusContent = styled.div`
  color: ${({ code, theme }) => code === 0 ?
    theme.contentSecondary : theme.content};
  display: flex;
  align-items: center;
`

const StatusText = styled.div`
  padding-top: 4px;
`

export default AllocationsHistory
