













import React from 'react';
import panjalaAjayImage from './assests/images/IMG_20220224_151929_654_Original.jpeg';

const Practice = () => {
  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '14px', color: '#333', lineHeight: '1.4' }}>
      <p style={{ margin: '0 0 8px 0', color: '#555' }}>Best regards,</p>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ paddingRight: '15px' }}>
              <img
                src={panjalaAjayImage}
                alt="Panjala Ajay"
                style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #007acc' }}
              />
            </td>
            <td>
              <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' }}>Panjala Ajay</p>
              <p style={{ margin: '2px 0', color: '#666', fontSize: '13px' }}>Software Engineer</p>
              <p style={{ margin: '2px 0', fontSize: '13px' }}>
                📞 <a href="tel:+919652145485" style={{ color: '#007acc', textDecoration: 'none' }}>+91 96521 45485</a>
              </p>
              <p style={{ margin: '2px 0', fontSize: '13px' }}>
                ✉️ <a href="mailto:ajaypanjala936@gmail.com" style={{ color: '#007acc', textDecoration: 'none' }}>ajaypanjala936@gmail.com</a>
              </p>
              <div style={{ marginTop: '6px' }}>
                <a href="https://www.linkedin.com/in/ajay-panjala-143436206/" target="_blank" rel="noreferrer" style={{ marginRight: '10px' }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" style={{ verticalAlign: 'middle' }} />
                </a>
                <a href="https://x.com/panjala1234" target="_blank" rel="noreferrer" style={{ marginRight: '10px' }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="20" height="20" style={{ verticalAlign: 'middle' }} />
                </a>
                <a href="https://www.instagram.com/ajay_goud_smart/" target="_blank" rel="noreferrer">
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" style={{ verticalAlign: 'middle' }} />
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Practice;



// import React from 'react';
// import panjalaAjayImage from './assests/images/IMG_20220224_151929_654_Original.jpeg';

// const Practice = () => {
//   return (
//     <div style={{
//       fontFamily: "'Poppins', 'Segoe UI', sans-serif",
//       fontSize: '14px',
//       color: '#333',
//       lineHeight: '1.6',
//       maxWidth: '500px',
//       borderLeft: '4px solid #4a89dc',
//       paddingLeft: '15px',
//       margin: '10px 0',
//       transition: 'all 0.3s ease'
//     }}>
//       <p style={{ 
//         margin: '0 0 10px 0', 
//         color: '#555',
//         fontSize: '13px',
//         fontWeight: '500',
//         letterSpacing: '0.5px'
//       }}>Warm regards,</p>
      
//       <div style={{ 
//         display: 'flex',
//         alignItems: 'center',
//         gap: '20px'
//       }}>
//         <div style={{
//           position: 'relative',
//           width: '80px',
//           height: '80px',
//           borderRadius: '50%',
//           background: 'linear-gradient(135deg, #4a89dc 0%, #8e44ad 100%)',
//           padding: '3px',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//         }}>
//           <img
//             src={panjalaAjayImage}
//             alt="Panjala Ajay"
//             style={{
//               width: '100%',
//               height: '100%',
//               borderRadius: '50%',
//               objectFit: 'cover',
//               border: '2px solid white'
//             }}
//           />
//         </div>
        
//         <div>
//           <h2 style={{
//             margin: '0 0 5px 0',
//             fontWeight: '700',
//             fontSize: '18px',
//             color: '#2c3e50',
//             letterSpacing: '0.5px',
//             position: 'relative',
//             display: 'inline-block'
//           }}>
//             Panjala Ajay
//             <span style={{
//               position: 'absolute',
//               bottom: '-3px',
//               left: '0',
//               width: '100%',
//               height: '2px',
//               background: 'linear-gradient(90deg, #4a89dc, #8e44ad)',
//               transform: 'scaleX(0.8)'
//             }}></span>
//           </h2>
          
//           <p style={{
//             margin: '0 0 8px 0',
//             color: '#7f8c8d',
//             fontSize: '14px',
//             fontWeight: '500'
//           }}>
//             <span style={{
//               display: 'inline-block',
//               width: '12px',
//               textAlign: 'center',
//               marginRight: '5px'
//             }}>👨‍💻</span>
//             Software Engineer
//           </p>
          
//           <div style={{ 
//             marginBottom: '8px',
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             <span style={{
//               display: 'inline-block',
//               width: '20px',
//               textAlign: 'center',
//               color: '#4a89dc',
//               fontSize: '16px'
//             }}>📞</span>
//             <a href="tel:+919652145485" style={{
//               color: '#4a89dc',
//               textDecoration: 'none',
//               marginLeft: '8px',
//               transition: 'all 0.2s ease',
//               fontWeight: '500'
//             }} onMouseOver={(e) => e.target.style.color = '#8e44ad'}
//                onMouseOut={(e) => e.target.style.color = '#4a89dc'}>
//               +91 96521 45485
//             </a>
//           </div>
          
//           <div style={{ 
//             marginBottom: '12px',
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             <span style={{
//               display: 'inline-block',
//               width: '20px',
//               textAlign: 'center',
//               color: '#4a89dc',
//               fontSize: '16px'
//             }}>✉️</span>
//             <a href="mailto:ajaypanjala936@gmail.com" style={{
//               color: '#4a89dc',
//               textDecoration: 'none',
//               marginLeft: '8px',
//               transition: 'all 0.2s ease',
//               fontWeight: '500'
//             }} onMouseOver={(e) => e.target.style.color = '#8e44ad'}
//                onMouseOut={(e) => e.target.style.color = '#4a89dc'}>
//               ajaypanjala936@gmail.com
//             </a>
//           </div>
          
//           <div style={{ 
//             display: 'flex',
//             gap: '12px',
//             alignItems: 'center'
//           }}>
//             <a href="https://www.linkedin.com/in/ajay-panjala-143436206/" 
//                target="_blank" 
//                rel="noopener noreferrer"
//                style={{ 
//                  color: 'transparent',
//                  transition: 'transform 0.3s ease'
//                }}
//                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
//                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
//               <div style={{
//                 width: '30px',
//                 height: '30px',
//                 borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//               }}>
//                 <img 
//                   src="https://cdn-icons-png.flaticon.com/512/174/174857.png" 
//                   alt="LinkedIn" 
//                   width="16" 
//                   height="16"
//                   style={{ filter: 'brightness(0) invert(1)' }}
//                 />
//               </div>
//             </a>
            
//             <a href="https://x.com/panjala1234" 
//                target="_blank" 
//                rel="noopener noreferrer"
//                style={{ 
//                  color: 'transparent',
//                  transition: 'transform 0.3s ease'
//                }}
//                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
//                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
//               <div style={{
//                 width: '30px',
//                 height: '30px',
//                 borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//               }}>
//                 <img 
//                   src="https://cdn-icons-png.flaticon.com/512/733/733579.png" 
//                   alt="Twitter" 
//                   width="16" 
//                   height="16"
//                   style={{ filter: 'brightness(0) invert(1)' }}
//                 />
//               </div>
//             </a>
            
//             <a href="https://www.instagram.com/ajay_goud_smart/" 
//                target="_blank" 
//                rel="noopener noreferrer"
//                style={{ 
//                  color: 'transparent',
//                  transition: 'transform 0.3s ease'
//                }}
//                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
//                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
//               <div style={{
//                 width: '30px',
//                 height: '30px',
//                 borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #405de6 0%, #5851db 20%, #833ab4 40%, #c13584 60%, #e1306c 80%, #fd1d1d 100%)',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//               }}>
//                 <img 
//                   src="https://cdn-icons-png.flaticon.com/512/174/174855.png" 
//                   alt="Instagram" 
//                   width="16" 
//                   height="16"
//                   style={{ filter: 'brightness(0) invert(1)' }}
//                 />
//               </div>
//             </a>
//           </div>
//         </div>
//       </div>
      
//       <p style={{
//         margin: '15px 0 0 0',
//         fontSize: '11px',
//         color: '#95a5a6',
//         fontStyle: 'italic',
//         borderTop: '1px dashed #e1e1e1',
//         paddingTop: '8px'
//       }}>
//         This email and its attachments are confidential. If you received this in error, please delete it.
//       </p>
//     </div>
//   );
// };

// export default Practice;