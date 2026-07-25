export interface CurrentUser {
  name: string;
  email: string;
  phone: string;
  initials: string;
}

/** The mock signed-in traveller. Everything in Manage Booking belongs to this account. */
export const currentUser: CurrentUser = {
  name: 'Chesca Way',
  email: 'chesca.way@example.com',
  phone: '+44 7700 900321',
  initials: 'CW',
};
