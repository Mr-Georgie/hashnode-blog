// components/Home.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { query } from "../lib/hashnode"; // Import your GraphQL query function

function Home() {
  const location = useLocation(); // Get current location
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await query({
          // Your GraphQL query to fetch posts
          query: `
            query {
              publication(host: "footprints.hashnode.dev") {
                posts(first: 10) {
                  edges {
                    node {
                      id
                      title
                      slug
                      coverImage {
                        url
                      }
                      publishedAt
                    }
                  }
                }
              }
            }
          `,
        });

        if (data && data.publication && data.publication.posts) {
          setPosts(data.publication.posts.edges.map((edge) => edge.node));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              to={`/posts/${post.slug}`}
              key={post.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={post.coverImage.url}
                alt={post.title}
                className="w-full h-48 object-cover object-center"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
