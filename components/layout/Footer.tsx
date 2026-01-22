export default function Footer() {
  return (
    <footer className="border-t border-black mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm">
          <p className="mb-2">© {new Date().getFullYear()} Snapped. All rights reserved.</p>
          <p className="text-gray-600">Made with passion for quality apparel.</p>
        </div>
      </div>
    </footer>
  );
}
