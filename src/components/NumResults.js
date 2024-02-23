export default function NumResults({ totalResults }) {
  return (
    <>
      {totalResults > 0 && (
        <p className="num-results">
          Found <strong>{totalResults}</strong> results
        </p>
      )}
    </>
  );
}
