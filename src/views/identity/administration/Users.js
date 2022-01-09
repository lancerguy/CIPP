import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { faPlus, faEdit, faTrash, faEllipsisV, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cellBooleanFormatter } from '../../../components/cipp'
import { CippPageList } from '../../../components'
import { TitleButton } from '../../../components/cipp'
import CippGroupedOffcanvas from 'src/components/cipp/CippGroupedOffcanvas'

const Offcanvas = (row, rowIndex, formatExtraData) => {
  const tenant = useSelector((state) => state.app.currentTenant)
  const [ocVisible, setOCVisible] = useState(false)
  const viewLink = `/identity/administration/users/view?userId=${row.id}&tenantDomain=${tenant.defaultDomainName}`
  const editLink = `/identity/administration/users/edit?userId=${row.id}&tenantDomain=${tenant.defaultDomainName}`
  return (
    <>
      <Link to={viewLink}>
        <CButton size="sm" variant="ghost" color="success">
          <FontAwesomeIcon icon={faEye} />
        </CButton>
      </Link>
      <Link to={editLink}>
        <CButton size="sm" variant="ghost" color="warning">
          <FontAwesomeIcon icon={faEdit} />
        </CButton>
      </Link>
      <CButton size="sm" variant="ghost" color="danger">
        <FontAwesomeIcon icon={faTrash} href="" />
      </CButton>
      <CButton size="sm" color="link" onClick={() => setOCVisible(true)}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </CButton>
      <CippGroupedOffcanvas
        title="User Information"
        extendedInfo={[
          { label: 'Given Name', value: `${row.givenName}` },
          { label: 'Surname', value: `${row.surname}` },
          { label: 'Created on', value: `${row.createdDateTime}` },
          { label: 'Job Title', value: `${row.jobTitle}` },
          { label: 'Unique ID', value: `${row.id}` },
        ]}
        actions={[
          {
            icon: <FontAwesomeIcon icon={faEye} className="me-2" />,
            label: 'View User',
            link: { viewLink },
            color: 'success',
          },
          {
            icon: <FontAwesomeIcon icon={faEdit} className="me-2" />,
            label: 'Edit User',
            link: { editLink },
            color: 'info',
          },
          {
            label: 'Research Compromised Account',
            link: `/identity/administration/users/bec?userId=${row.id}&tenantDomain=${tenant.defaultDomainName}`,
            color: 'primary',
          },
          { label: 'Send MFA Push', link: 'dothis', color: 'primary' },
          { label: 'Convert to shared mailbox', link: 'dothis', color: 'primary' },
          { label: 'Block Sign-in', link: 'dothis', color: 'warning' },
          { label: 'Reset Password (Must Change)', link: 'dothis', color: 'warning' },
          { label: 'Reset Password', link: 'dothis', color: 'warning' },
          { label: 'Delete User', link: 'dothis', color: 'danger' },
        ]}
        placement="end"
        visible={ocVisible}
        id={row.id}
        hideFunction={() => setOCVisible(false)}
      />
    </>
  )
}

const columns = [
  {
    name: 'Display Name',
    selector: (row) => row['displayName'],
    sortable: true,
    exportSelector: 'displayName',
  },
  {
    name: 'Email',
    selector: (row) => row['mail'],
    sortable: true,
    exportSelector: 'mail',
  },
  {
    name: 'User Type',
    selector: (row) => row['userType'],
    sortable: true,
    exportSelector: 'userType',
    minWidth: '50px',
    maxWidth: '140px',
  },
  {
    name: 'Enabled',
    selector: (row) => row['accountEnabled'],
    cell: cellBooleanFormatter(),
    sortable: true,
    exportSelector: 'accountEnabled',
    minWidth: '50px',
    maxWidth: '90px',
  },
  {
    name: 'AD Synced',
    selector: (row) => row['onPremisesSyncEnabled'],
    cell: cellBooleanFormatter(),
    sortable: true,
    exportSelector: 'onPremisesSyncEnabled',
    minWidth: '50px',
    maxWidth: '110px',
  },
  {
    name: 'Licenses',
    selector: (row) => row['LicJoined'],
    exportSelector: 'LicJoined',
    grow: 3,
  },
  {
    name: 'id',
    selector: (row) => row['id'],
    omit: true,
  },
  {
    name: 'Actions',
    cell: Offcanvas,
  },
]

const Users = () => {
  const tenant = useSelector((state) => state.app.currentTenant)
  const titleButton = (
    <TitleButton href="/identity/administration/users/add" title="Add User" icon={faPlus} />
  )
  return (
    <CippPageList
      title="Users"
      titleButton={titleButton}
      datatable={{
        columns,
        path: '/api/ListUsers',
        reportName: `${tenant?.defaultDomainName}-Users`,
        params: { TenantFilter: tenant?.defaultDomainName },
      }}
    />
  )
}

export default Users
