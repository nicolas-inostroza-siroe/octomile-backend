import { UserRoleGuard } from '@src/user-role.guard';

describe('UserRoleGuard', () => {
  it('should be defined', () => {
    expect(new UserRoleGuard()).toBeDefined();
  });
});
