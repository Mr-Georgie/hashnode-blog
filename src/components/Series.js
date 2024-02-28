// components/Series.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { query } from "../lib/hashnode"; //

function Series() {
  const { slug } = useParams();
  const location = useLocation(); // Get current location
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const { data } = await query({
          // Your GraphQL query to fetch the series by slug
          query: `
            query GetSeriesBySlug($host: String!, $slug: String!) {
              publication(host: $host) {
                series(slug: $slug) {
                  id
                  name
                  coverImage
                  description {
                    html
                  }
                  posts(first: 10) {
                    edges {
                      node {
                        id
                        title
                        coverImage {
                          url
                        }
                        publishedAt
                        slug
                      }
                    }
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

        if (data && data.publication && data.publication.series) {
          setSeries(data.publication.series);
          console.log(data.publication.series);
        }
      } catch (error) {
        console.error("Error fetching series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [slug, location]);

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{series.name}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: series.description.html }}
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.posts.edges.map(({ node }) => (
              <Link
                to={`/posts/${node.slug}`}
                key={node.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
              >
                <img
                  src={node.coverImage.url}
                  alt={node.title}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{node.title}</h2>
                  <p className="text-gray-500">
                    {new Date(node.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Series;
