import {
  can,
  isLeaderRole,
  isMemberRole,
  isOfficerRole,
} from 'server/guild/permissions'

describe('guild permissions', () => {
  it('leader can exclude officer/member legacy roles', () => {
    expect(can.LEADER.exclude('OFFICER')).toBe(true)
    expect(can.LEADER.exclude('MEMBER')).toBe(true)
    expect(can.LEADER.exclude('MODERATOR')).toBe(true)
    expect(can.LEADER.exclude('USER')).toBe(true)
    expect(can.LEADER.exclude('LEADER')).toBe(false)
  })

  it('officer can only exclude member-like roles', () => {
    expect(can.OFFICER.exclude('MEMBER')).toBe(true)
    expect(can.OFFICER.exclude('USER')).toBe(true)
    expect(can.OFFICER.exclude('OFFICER')).toBe(false)
    expect(can.OFFICER.exclude('LEADER')).toBe(false)
  })

  it('role guards map legacy and new roles', () => {
    expect(isLeaderRole('ADMIN')).toBe(true)
    expect(isLeaderRole('LEADER')).toBe(true)
    expect(isOfficerRole('MODERATOR')).toBe(true)
    expect(isOfficerRole('OFFICER')).toBe(true)
    expect(isMemberRole('USER')).toBe(true)
    expect(isMemberRole('MEMBER')).toBe(true)
  })
})
