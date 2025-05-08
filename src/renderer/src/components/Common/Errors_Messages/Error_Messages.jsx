export function errorMessage(error) {
  //   console.log('error:', error);
  if (error?.message?.includes('unique')) {
    const match = error?.message.match(/unique constraint ".*?_(\w+)_key"/);
    return `${match ? match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase() : null} Already Exists.`;
  } else if (error?.message?.includes('value too long')) {
    return 'Value too long';
  } else if (error?.message?.includes('Missing required field')) {
    return 'Missing required field';
  } else if (error?.message?.includes('Missing required fields')) {
    return 'Missing required fields';
  } else if (error?.message?.includes('invalid input syntax for type date')) {
    return 'Invalid date format';
  } else {
    return 'Something went wrong!';
  }
}
