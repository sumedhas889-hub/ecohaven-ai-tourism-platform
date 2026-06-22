/**
 * Button Component
 * @param {string} text
 * @param {function} onClick
 */

export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-700 text-white px-4 py-2 rounded-lg"
    >
      {text}
    </button>
  );
}