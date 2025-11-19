import BlogList from "./BlogList";
import useFetch from "./useFetch";

const Home = () => {
   // Use json-server in development if available, otherwise use static file
   // For Vercel deployment, this will use the static /blogs.json file
   const apiUrl = import.meta.env.DEV && import.meta.env.VITE_USE_JSON_SERVER === 'true'
     ? 'http://localhost:8000/blogs'
     : '/blogs.json';

   const {data:blogs,error,loading} = useFetch(apiUrl)

    return (<div className="home">
        {error && <div>{error}</div>}
        {loading && <div>Loading.....</div>}
        {blogs && <BlogList blogs={blogs} title="Books List" />}
    </div>);
}

export default Home;