// components/Post.js
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { query } from "../lib/hashnode"; // Import your GraphQL query function

function Post() {
  const { slug } = useParams();
  const location = useLocation(); // Get current location
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await query({
          // Your GraphQL query to fetch the post by slug
          query: `
            query GetPostBySlug($host: String!, $slug: String!) {
              publication(host: $host) {
                post(slug: $slug) {
                  id
                  title
                  coverImage {
                    url
                  }
                  publishedAt
                  content {
                    html
                  }
                }
              }
            }
          `,
          variables: {
            host: "footprints.hashnode.dev",
            slug: slug,
          },
        });

        if (data && data.publication && data.publication.post) {
          setPost(data.publication.post);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, location]);

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <img
            src={post.coverImage.url}
            alt={post.title}
            className="w-full h-auto mb-8"
          />
          <div dangerouslySetInnerHTML={{ __html: post.content.html }} />
        </>
      )}
    </div>
  );
}

export default Post;
