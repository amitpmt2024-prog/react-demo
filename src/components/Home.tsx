import BlogList from "./BlogList";
import useFetch from "./useFetch";

const Home = () => {
   const {data:blogs,error,loading} = useFetch('http://localhost:8000/blogs')

    return (<div className="home">
        {error && <div>{error}</div>}
        {loading && <div>Loading.....</div>}
        {blogs && <BlogList blogs={blogs} title="Books List" />}
    </div>);
}

export default Home;