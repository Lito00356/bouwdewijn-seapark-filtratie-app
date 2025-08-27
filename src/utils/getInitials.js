export function getInitials(name) {
  return name.split(/[\s-]+/)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}