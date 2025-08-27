export function formatSubdepartmentName(name) {
  return name.replace(/ pool/gi, '').trim();
}