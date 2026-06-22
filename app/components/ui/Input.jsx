/**
 * Input Component
 * @param {string} placeholder
 */

export default function Input({ placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="border p-2 rounded-lg w-full"
    />
  );
}