import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import {
  Text,
  theme,
  Badge,
  Checkbox,
  ContextMenu,
  ContextMenuItem,
  Viewport,
} from '@aragon/ui'

import { formatDistance } from 'date-fns'
import { BountyContextMenu } from '../Shared'
import { BOUNTY_STATUS, BOUNTY_BADGE_COLOR } from '../../utils/bounty-status'

const ClickArea = styled.div`
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 0;
  :active {
    border: 1px solid ${theme.accent};
    z-index: 3;
  }
  :hover {
    cursor: pointer;
  }
`
const DeadlineDistance = date =>
  formatDistance(new Date(date), new Date(), { addSuffix: true })

const dot = <span style={{ margin: '0px 6px' }}>&middot;</span>

const labelsBadges = labels =>
  labels.edges.map(label => (
    <Badge
      key={label.node.id}
      style={{ marginRight: '10px', width: 'auto' }}
      background={'#' + label.node.color}
      foreground={'#000'}
    >
      {label.node.name}
    </Badge>
  ))

const Issue = ({
  work,
  workStatus,
  title,
  repo,
  number,
  labels,
  isSelected,
  onSelect,
  onClick,
  onSubmitWork,
  onRequestAssignment,
  onReviewApplication,
  onAllocateSingleBounty,
  onReviewWork,
  balance,
  symbol,
  deadline,
  requestsData,
  bountySettings,
  expLevel,
  slots,
}) => {
  //console.log('CARD:', workStatus, title, repo, number, labels, isSelected, balance, symbol, deadline, requestsData, expLevel, slots)

  // prepare display of number of slots vs number of applicants - leaving for reference, #528
  /*
  const slotsAllocation =
    requestsData === undefined
      ? 'Unallocated (' + slots + ')'
      : requestsData.length < slots
        ? 'Slots available: ' + (slots - requestsData.length) + '/' + slots
        : 'Allocated'
  */

  return (
    <StyledIssue>
      <div style={{ padding: '10px' }}>
        <Checkbox checked={isSelected} onChange={onSelect} />
      </div>

      <IssueData>
        <ClickArea onClick={onClick} />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text color={theme.textSecondary} size="small">
            {repo} #{number}
          </Text>
          {workStatus !== 'fulfilled' && (
            <ContextMenu>
              <BountyContextMenu
                work={work}
                workStatus={workStatus}
                requestsData={requestsData}
                onAllocateSingleBounty={onAllocateSingleBounty}
                onSubmitWork={onSubmitWork}
                onRequestAssignment={onRequestAssignment}
                onReviewApplication={onReviewApplication}
                onReviewWork={onReviewWork}
              />
            </ContextMenu>
          )}
        </div>

        <IssueTitleDetailsBalance>
          <IssueTitleDetails>
            <IssueTitle>
              {title}
            </IssueTitle>

            {(balance > 0) && (
              <Text.Block size="small" color={theme.textTertiary}>
                <span style={{ marginRight: '15px' }}>
                  {BOUNTY_STATUS[workStatus]}
                  {dot}
                  {expLevel}
                  {dot}
                  Due in {DeadlineDistance(deadline)}
                </span>
              </Text.Block>
            )}
            {(balance > 0) && (
              <Text.Block size="small" color={theme.textTertiary}>
                <span style={{ marginRight: '15px' }}>
                  {slots} Available
                  {dot}
                  {requestsData.length} Applicants
                </span>
              </Text.Block>
            )}
          </IssueTitleDetails>

          <Balance>
            {balance > 0 && (
              <Badge
                style={{ padding: '5px 10px' }}
                background={BOUNTY_BADGE_COLOR[workStatus].bg}
                foreground={BOUNTY_BADGE_COLOR[workStatus].fg}
              >
                <Text size="large">
                  {balance + ' ' + symbol}
                </Text>
              </Badge>
            )}
          </Balance>
        </IssueTitleDetailsBalance>

        {(labels.totalCount > 0) && (
          <div>
            <Separator />
            {labelsBadges(labels)}
          </div>
        )}
      </IssueData>
    </StyledIssue>
  )
}

Issue.propTypes = {
  title: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  workStatus: PropTypes.oneOf([ undefined, 'funded', 'review-applicants', 'in-progress', 'review-work', 'fulfilled' ]),
  work: PropTypes.oneOf([
    undefined,
    PropTypes.object,
  ]),
}

const StyledIssue = styled.div`
  flex: 1;
  width: 100%;
  background: ${theme.contentBackground};
  display: flex;
  height: auto;
  align-items: center;
  border-radius: 3px;
  border: 1px solid ${theme.contentBorder};
  margin-bottom: -1px;
  position: relative;
`
const IssueTitleDetailsBalance = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const IssueTitleDetails = styled.div`
  display: flex;
  flex-direction: column;
  > :not(:last-child) {
    margin-bottom: 6px;
  }
`
const IssueData = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: space-around;
  padding: 12px 12px 12px 0;
  position: relative;
`
const Balance = styled.div`
  margin-left: 10px;
`
const IssueTitle = styled(Text.Block).attrs({
  size: 'large',
})`
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${theme.textPrimary};
`
const Separator = styled.hr`
  height: 1px;
  width: 100%;
  color: ${theme.contentBorder};
  opacity: 0.1;
  margin: 8px 0;
`

export default Issue
