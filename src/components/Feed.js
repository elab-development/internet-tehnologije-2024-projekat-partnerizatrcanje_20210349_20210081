import React, { useState, useEffect } from "react";
import Post from "./Post";
import useApi from "../hooks/useApi"; // Import custom hook
import "../styles/Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });
  const [loadingMore, setLoadingMore] = useState(false);

  // Dohvati korisnika i ulogu
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'guest';
  const isGuest = userRole === 'guest';

  // Custom hook za glavni feed API poziv
  const { 
    data: feedData, 
    loading, 
    error: apiError, 
    fetchData 
  } = useApi(); // Ne prosleđujemo URL jer ćemo koristiti fetchData manualno

  const [error, setError] = useState("");

  // Funkcija za dohvatanje postova sa servera koristeći custom hook
  const fetchPosts = async (page = 1, append = false) => {
    try {
      if (!append) {
        // Početno učitavanje se već handluje preko loading state-a iz hook-a
      } else {
        setLoadingMore(true);
      }
      
      const token = localStorage.getItem("auth_token");
      
      // Različiti headers na osnovu da li je korisnik guest ili ne
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
      };
      
      // Dodaj Authorization header samo ako nije guest
      if (!isGuest && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      console.log("Making API call with headers:", headers, "isGuest:", isGuest); // Debug
      
      // Koristi fetchData iz custom hook-a
      const data = await fetchData(
        `http://localhost:8000/api/feed?page=${page}`,
        {
          method: "GET",
          headers: headers
        }
      );

      if (data) {
        console.log("Feed data:", data); // Debug
        console.log("Pagination info:", {
          current_page: data.current_page,
          last_page: data.last_page,
          total: data.total,
          from: data.from,
          to: data.to
        }); // Debug pagination

        // Laravel pagination struktura
        if (data.data) {
          console.log("Posts data:", data.data); // Debug posts
          console.log("First post ID:", data.data[0]?.id, "Last post ID:", data.data[data.data.length - 1]?.id); // Debug IDs
          
          // Dodaj postove na postojeće ili zameni
          if (append) {
            setPosts(prevPosts => [...prevPosts, ...data.data]);
          } else {
            setPosts(data.data);
          }
          
          // Ažuriraj pagination info
          setPagination({
            current_page: data.current_page,
            last_page: data.last_page,
            per_page: data.per_page || 15,
            total: data.total,
            from: data.from,
            to: data.to
          });
        } else {
          // Fallback ako nema pagination wrapper-a
          setPosts(append ? prevPosts => [...prevPosts, ...data] : data);
        }

        setError("");
      }
    } catch (error) {
      console.error("Greška pri dohvatanju postova:", error);
      setError("Greška pri učitavanju postova. Molimo pokušajte ponovo.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Učitaj postove kada se komponenta mount-uje
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Handle API error from custom hook
  useEffect(() => {
    if (apiError) {
      setError("Greška pri učitavanju postova. Molimo pokušajte ponovo.");
    }
  }, [apiError]);

  // Funkcija za učitavanje više postova (Load More)
  const loadMorePosts = () => {
    if (pagination.current_page < pagination.last_page && !loadingMore) {
      fetchPosts(pagination.current_page + 1, true);
    }
  };

  // Funkcija za prelazak na prethodnu stranicu
  const goToPreviousPage = () => {
    if (pagination.current_page > 1 && !loading) {
      fetchPosts(pagination.current_page - 1, false);
    }
  };

  // Funkcija za prelazak na sledeću stranicu
  const goToNextPage = () => {
    if (pagination.current_page < pagination.last_page && !loading) {
      fetchPosts(pagination.current_page + 1, false);
    }
  };

  // Funkcija za refresh feed-a
  const refreshFeed = () => {
    fetchPosts(1, false);
  };

  // Custom hook za dodavanje komentara
  const { 
    post: addCommentRequest, 
    loading: commentLoading 
  } = useApi();

  // Funkcija za dodavanje komentara u određeni post (samo registrovani korisnici)
  const addComment = async (postId, commentContent) => {
    // Guest korisnici ne mogu dodavati komentare
    if (isGuest) {
      alert("Gost korisnici ne mogu dodavati komentare. Molimo registrujte se.");
      return;
    }

    try {
      const newComment = await addCommentRequest({
        post_id: postId,
        content: commentContent
      });

      if (newComment) {
        // Ažuriraj postove sa novim komentarom
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), newComment.comment]
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Greška pri dodavanju komentara:", error);
      alert("Greška pri dodavanju komentara");
    }
  };

  // Custom hook za pridruživanje planu
  const { 
    post: joinPlanRequest, 
    loading: joinLoading 
  } = useApi();

  // Funkcija za pridruživanje planu trčanja
  const joinPlan = async (postId) => {
    try {
      const token = localStorage.getItem("auth_token");
      
      const data = await fetchData(
        `http://localhost:8000/api/posts/${postId}/join`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      if (data) {
        // Ažuriraj post sa novim brojem učesnika
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                current_participants: data.plan.current_participants,
                participants: data.plan.participants || []
              };
            }
            return post;
          })
        );
        
        alert("Uspešno ste se pridružili planu!");
      }
    } catch (error) {
      console.error("Greška pri pridruživanju planu:", error);
      alert("Greška pri pridruživanju planu");
    }
  };

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="feed">
        <div className="loading-message">
          <p>Učitavanje postova...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && posts.length === 0) {
    return (
      <div className="feed">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={refreshFeed} className="retry-button">
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      {/* Header sa refresh dugmetom */}
      <div className="feed-header">
        <h2>{isGuest ? 'Pregled postova' : 'Feed'}</h2>
        {/* Guest korisnici ne mogu refresh-ovati */}
        {!isGuest && (
          <button onClick={refreshFeed} className="refresh-button" disabled={loading}>
            {loading ? "Učitavanje..." : "Osveži"}
          </button>
        )}
        
        {/* Poruka za guest korisnike */}
        {isGuest && (
          <div className="guest-info">
            <span>Registrujte se za potpunu funkcionalnost</span>
          </div>
        )}
      </div>

      {/* Error message ako postoji */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Lista postova */}
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              title={post.title}
              name={post.user?.name || "Nepoznat korisnik"}
              surname={post.user?.surname || ""}
              content={post.content}
              duration={post.duration}
              frequency={post.frequency}
              distance={post.distance}
              max_participants={post.max_participants}
              current_participants={post.current_participants || 0}
              created_at={post.created_at}
              comments={post.comments || []}
              participants={post.participants || []} // Proslijedi učesnike
              addComment={addComment}
              onJoinPlan={joinPlan} // Proslijedi join funkciju
              isGuest={isGuest}
            />
          ))}

          {/* Pagination info */}
          <div className="pagination-info">
            <p>
              Prikazano {pagination.from}-{pagination.to} od {pagination.total} postova
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button 
              onClick={goToPreviousPage}
              className="pagination-button prev-button"
              disabled={pagination.current_page <= 1 || loading}
            >
              Prethodna
            </button>
            
            <div className="page-info">
              Stranica {pagination.current_page} od {pagination.last_page}
            </div>
            
            <button 
              onClick={goToNextPage}
              className="pagination-button next-button"
              disabled={pagination.current_page >= pagination.last_page || loading}
            >
              Sledeća
            </button>
          </div>

          {/* Load More dugme kao alternativa */}
          {pagination.current_page < pagination.last_page && (
            <div className="load-more-container">
              <button 
                onClick={loadMorePosts} 
                className="load-more-button"
                disabled={loadingMore}
              >
                {loadingMore ? "Učitavanje..." : "Učitaj više postova"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-posts-message">
          <p>Nema postova za prikaz.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;