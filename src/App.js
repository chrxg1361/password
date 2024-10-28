import React, { useState } from 'react';
import './App.css';

function App() {
  const [masterCode, setMasterCode] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [currentPage, setCurrentPage] = useState('lock');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(8);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwords, setPasswords] = useState([]);

  const handleMasterCodeChange = (event) => {
    const value = event.target.value;
    setMasterCode(value);
  };

  const unlockWebsite = () => {
    if (masterCode === '1234') {
      setIsLocked(false);
      setCurrentPage('yourPasswords');
    } else {
      alert('Incorrect master code!');
    }
  };

  const updatePasswordLengthValue = (event) => {
    const value = parseInt(event.target.value);
    document.getElementById("passwordLengthValue").textContent = value;
    setPasswordLength(value);
  };

  const generatePassword = () => {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digitChars = "1234567890";
    const specialChars = "!@#$%^&*()_+-={}[];<>:";

    let dictionary = "";
    if (document.getElementById("lowercaseCb").checked) dictionary += lowercaseChars;
    if (document.getElementById("uppercaseCb").checked) dictionary += uppercaseChars;
    if (document.getElementById("digitsCb").checked) dictionary += digitChars;
    if (document.getElementById("specialsCb").checked) dictionary += specialChars;

    if (passwordLength < 1 || dictionary.length === 0) return;

    let password = Array.from({ length: passwordLength }, () => dictionary[Math.floor(Math.random() * dictionary.length)]).join('');
    setGeneratedPassword(password);
    checkPasswordStrength(password); 
  };

  const copyToClipboard = () => {
    const generatedPasswordField = document.getElementById("generatedPassword");
    generatedPasswordField.select();
    document.execCommand("copy");
    alert("Password copied to clipboard!");
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++; 
    if (/[A-Z]/.test(password)) strength++; 
    if (/[a-z]/.test(password)) strength++; 
    if (/\d/.test(password)) strength++; 
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++; 

    setPasswordStrength(strength);
  };

  const getBarColor = (index) => {
    if (index + 1 <= passwordStrength) {
      if (passwordStrength === 1) return "red";
      if (passwordStrength === 2) return "orange";
      if (passwordStrength === 3) return "yellow";
      if (passwordStrength >= 4) return "green";
    }
    return "red"; 
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleAddPassword = () => {
    const website = document.getElementById('website').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const newPasswords = [...passwords, { website, username, password }];
    setPasswords(newPasswords);
    setCurrentPage('yourPasswords');
  };

  const handleDeletePassword = (index) => {
    const updatedPasswords = [...passwords];
    updatedPasswords.splice(index, 1);
    setPasswords(updatedPasswords);
  };

  const handleBack = () => {
    setCurrentPage('lock');
    setIsLocked(true);
  };

  const handleLock = () => {
    setIsLocked(true);
    setCurrentPage('lock');
  };

  return (
    <div className="container">
      <nav>
        <div className="logo">Surepass</div>
        <ul>
          <li onClick={isLocked ? null : () => handleNavigation('yourPasswords')}>Your Passwords</li>
          <li onClick={isLocked ? null : () => handleNavigation('addPassword')}>Add a Password</li>
          <li onClick={isLocked ? null : () => handleNavigation('passwordGenerator')}>Password Generator</li>
          <li onClick={isLocked ? null : () => handleNavigation('strengthChecker')}>Password Strength Checker</li>
          {isLocked && (
            <li onClick={unlockWebsite}>Unlock</li>
          )}
        </ul>
      </nav>

      {isLocked && currentPage === 'lock' && (
        <div>
          <h2>Enter Master Code</h2>
          <input type="password" value={masterCode} onChange={handleMasterCodeChange} />
          <button onClick={unlockWebsite}>Unlock</button>
        </div>
      )}

      {!isLocked && (
        <div>
          <h1>Password Manager</h1>

          {currentPage === 'yourPasswords' && (
            <div>
              <h2>Your Passwords</h2>
              <table>
                <thead>
                  <tr>
                    <th>Website</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {passwords.map((password, index) => (
                    <tr key={index}>
                      <td>{password.website}</td>
                      <td>{password.username}</td>
                      <td>{password.password}</td>
                      <td><button onClick={() => handleDeletePassword(index)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleBack}>Back</button>
            </div>
          )}

          {currentPage === 'addPassword' && (
            <div>
              <h2>Add a Password</h2>
              <form onSubmit={handleAddPassword}>
                <label htmlFor="website">Website:</label>
                <input type="text" id="website" name="website" required />
                <br /><br />
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <br /><br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <br />
                <button type="submit">Submit</button>
              </form>
              <button onClick={handleBack}>Back</button>
            </div>
          )}

          {currentPage === 'passwordGenerator' && (
            <div>
              <h2>Password Generator</h2>
              <div className="generator">
                <div className="password">
                  <input type="text" id="generatedPassword" value={generatedPassword} readOnly />
                  <button onClick={copyToClipboard}>Copy</button>
                </div>
                <div className="range">
                  <input type="range" min="4" max="24" value={passwordLength} id="passwordLength" onChange={updatePasswordLengthValue} />
                  <span id="passwordLengthValue">{passwordLength}</span>
                  <button onClick={generatePassword}>Generate</button>
                </div>
                <div className="options">
                  <div className="option">
                    <label>
                      <input type="checkbox" id="lowercaseCb" defaultChecked />
                      <span>a-z</span>
                    </label>
                  </div>
                  <div className="option">
                    <label>
                      <input type="checkbox" id="uppercaseCb" defaultChecked />
                      <span>A-Z</span>
                    </label>
                  </div>
                  <div className="option">
                    <label>
                      <input type="checkbox" id="digitsCb" defaultChecked />
                      <span>0-9</span>
                    </label>
                  </div>
                  <div className="option">
                    <label>
                      <input type="checkbox" id="specialsCb" defaultChecked />
                      <span>!@$#%^</span>
                    </label>
                  </div>
                </div>
              </div>
              <button onClick={handleBack}>Back</button>
            </div>
          )}

          {currentPage === 'strengthChecker' && (
            <div>
              <h2>Password Strength Checker</h2>
              <div className="inputArea">
                <input type="password" placeholder="Password" id="passwordStrengthInput" onInput={(e) => checkPasswordStrength(e.target.value)} />
                <div className="strengthMeter">
                  <div className="bar" style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: getBarColor(0) }}></div>
                </div>
              </div>
              <button onClick={handleBack}>Back</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
