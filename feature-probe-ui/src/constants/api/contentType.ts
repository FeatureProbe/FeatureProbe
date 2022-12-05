export const ApplicationJson = () => {
  return {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem('i18n')?.replaceAll('"', '') || 'en-US',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'X-OrganizeID': localStorage.getItem('organizeId') || '',
  };
};