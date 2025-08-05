import React, { useState } from "react";
import '../styles/Post.css';

const Post = ({ 
  id, 
  title,
  name, 
  surname,
  content, 
  duration,
  frequency,
  distance, 
  max_participants,
  current_participants = 0,
  created_at,
  comments, 
  addComment,
  isGuest = false,
  participants = [], // Nova prop za učesnike
  onJoinPlan // Nova prop za join funkciju
}) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [joiningPlan, setJoiningPlan] = useState(false);

  // Dohvati trenutnog korisnika
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = currentUser.id === participants.find(p => p.pivot?.user_id === currentUser.id)?.pivot?.user_id;
  const hasJoined = participants.some(p => p.id === currentUser.id);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    // Guest korisnici ne mogu dodavati komentare
    if (isGuest) {
      alert("Registrujte se da biste mogli dodavati komentare.");
      return;
    }

    setSubmittingComment(true);
    
    try {
      await addComment(id, commentText.trim());
      setCommentText("");
    } catch (error) {
      console.error("Greška pri dodavanju komentara:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleJoinPlan = async () => {
    if (isGuest) {
      alert("Registrujte se da biste se mogli pridružiti planu.");
      return;
    }

    if (hasJoined) {
      alert("Već ste pridruženi ovom planu.");
      return;
    }

    if (current_participants >= max_participants) {
      alert("Plan je popunjen.");
      return;
    }

    setJoiningPlan(true);
    try {
      await onJoinPlan(id);
    } catch (error) {
      console.error("Greška pri pridruživanju planu:", error);
    } finally {
      setJoiningPlan(false);
    }
  };

  // Formatiranje datuma
  const formatDate = (dateString) => {
    if (!dateString) return "Nepoznato";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Nepoznato";
    }
  };

  // Formatiranje trajanja
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
  };

  // Formatiranje frequency
  const formatFrequency = (freq) => {
    if (!freq) return "N/A";
    return `${freq}x nedeljno`;
  };

  const fullName = surname ? `${name} ${surname}` : name;

  return (
    <div className="post">
      {/* Post header */}
      <div className="post-header">
        <div className="post-author">
          <h3>{fullName}</h3>
        </div>
        <div className="post-meta">
          <span className="post-creation-date">{formatDate(created_at)}</span>
        </div>
      </div>

      {/* Post content */}
      <div className="post-content">
        <h2 className="post-title">{title || "Plan trčanja"}</h2>
        
        {/* Plan description */}
        {content && (
          <div className="post-description">
            <h4>Opis plana:</h4>
            <p>{content}</p>
          </div>
        )}
        
        {/* Creation date - ZADRŽANO IZ PRVOG KODA */}
        <div className="post-date-info">
          <span className="date-label">Kreiran:</span>
          <span className="date-value">{formatDate(created_at)}</span>
        </div>
        
        {/* Post details */}
        <div className="post-details">
          <div className="detail-item">
            <span className="detail-label">Distanca:</span>
            <span className="detail-value">{distance} km</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Trajanje:</span>
            <span className="detail-value">{formatDuration(duration)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Učestalost:</span>
            <span className="detail-value">{formatFrequency(frequency)}</span>
          </div>
          
          <div 
            className={`detail-item ${participants.length > 0 ? 'participants-item' : ''}`}
            onMouseEnter={() => participants.length > 0 && setShowParticipants(true)}
            onMouseLeave={() => setShowParticipants(false)}
          >
            <span className="detail-label">Učesnici:</span>
            <span className="detail-value">
              {current_participants}/{max_participants}
              
              {/* Participants tooltip */}
              {showParticipants && participants.length > 0 && (
                <div className="participants-tooltip">
                  <div className="tooltip-header">
                    Učesnici:
                  </div>
                  {participants.map((participant, index) => (
                    <div key={index} className="participant-item">
                      {participant.name} {participant.surname}
                      {(participant.email || (participant.id === currentUser.id && currentUser.email)) && (
                        <span className="participant-email">
                          ({participant.email || (participant.id === currentUser.id ? currentUser.email : '')})
                        </span>
                      )}
                    </div>
                  ))}
                  {participants.length === 0 && (
                    <div className="no-participants">Nema učesnika</div>
                  )}
                </div>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Post actions */}
      <div className="post-actions">
        <button 
          className="comment-toggle-button"
          onClick={toggleComments}
        >
          {showComments ? "Sakrij" : "Prikaži"} komentare ({comments?.length || 0})
        </button>

        {/* Join dugme - samo registrovani korisnici sa svim funkcionalnostima iz drugog koda */}
        {!isGuest && (
          <button 
            className={`join-button ${hasJoined ? 'joined' : ''} ${current_participants >= max_participants ? 'full' : ''}`}
            onClick={handleJoinPlan}
            disabled={joiningPlan || hasJoined || current_participants >= max_participants}
          >
            {joiningPlan ? "Pridružujem..." : 
             hasJoined ? "Pridružen" :
             current_participants >= max_participants ? "Popunjen" : 
             "Pridruži se"}
          </button>
        )}

        {/* Poruka za guest korisnike */}
        {isGuest && (
          <span className="guest-message">
            Registrujte se za pridružavanje
          </span>
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="comments-section">
          {/* Existing comments */}
          <div className="existing-comments">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-author">
                    <strong>
                      {comment.user 
                        ? `${comment.user.name} ${comment.user.surname || ""}`.trim()
                        : "Nepoznat korisnik"
                      }
                    </strong>
                    {comment.created_at && (
                      <span className="comment-date">
                        {formatDate(comment.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">Nema komentara.</p>
            )}
          </div>

          {/* Add comment form - samo registrovani korisnici */}
          {!isGuest ? (
            <form onSubmit={handleCommentSubmit} className="add-comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Dodaj komentar..."
                rows="3"
                disabled={submittingComment}
                required
              ></textarea>
              <button 
                type="submit" 
                disabled={submittingComment || commentText.trim() === ""}
                className="submit-comment-button"
              >
                {submittingComment ? "Šalje..." : "Dodaj komentar"}
              </button>
            </form>
          ) : (
            <div className="guest-comment-message">
              <p>
                <strong>Registrujte se</strong> da biste mogli dodavati komentare.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;