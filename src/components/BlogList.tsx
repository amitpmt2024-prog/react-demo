const BlogList = ({blogs,title}) => {
    return (<div>
         <h1>{title}</h1>
         {blogs.map((blog:string) => (
            <div className="blog-preview" key="blog.id" >
                <h2>{blog.title}</h2>
                <p>Written by {blog.author}</p>
                {/* <button onClick={() => handleDelete(blog.id)}>Delete Blog</button> */}
                </div>
            ))}
    </div>  );
}
 
export default BlogList;