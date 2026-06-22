/**
 * Toast Component
 * @param {string} message
 */

export default function Toast({ message }) {
  return (
    <div className="fixed bottom-4 right-4 bg-green-700 text-white px-4 py-2 rounded">
      {message}
    </div>
  );
}