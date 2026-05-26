// Backend-only flag registry. Never sent to client.
// Round 2 ASCII parts: CTF{ + 83,69,67(SEC) + 82,69,84(RET) + 45,50,55(-27) + }
module.exports = {
  1: 'CTF{OBSERVE_THE_UNSEEN}',
  2: 'CTF{SECRET-27}',
  3: 'CTF{HIDDEN_PATH_DISCOVERED}',
  4: 'CTF{XSS_PAYLOAD_EXECUTED}',
  5: 'CTF{JWT_NONE_ALG_BYPASS}',
  6: 'CTF{IDOR_ENUMERATION_SUCCESS}',
  7: 'CTF{SOURCE_MAP_LEAK}',
  8: 'CTF{FIRST_LETTERS}',
  9: 'CTF{CAESAR_SHIFT_THIRTEEN}',
  10: 'CTF{ARCHER_NX17_1987}'
};

module.exports.SCORE_PER_ROUND = 100;
