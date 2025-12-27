const Home = () => {
  return (
    <>
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Trusted Services in Your Neighborhood
          </h1>
          <p className="text-lg mb-8">
            Connect with local service providers quickly and safely.
          </p>

          <div className="bg-white p-4 rounded-lg flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search service"
              className="flex-1 border px-4 py-2 rounded-md text-gray-700"
            />
            <input
              type="text"
              placeholder="Location"
              className="flex-1 border px-4 py-2 rounded-md text-gray-700"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Search
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
