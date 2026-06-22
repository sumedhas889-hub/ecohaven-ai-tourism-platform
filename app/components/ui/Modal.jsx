/**
 * Modal Component
 * @param {boolean} isOpen
 * @param {string} title
 */

export default function Modal({ isOpen, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </div>
  );
}