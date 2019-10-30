/**
 * This function creates pronunciation hints for the screen reader.  
 * 
 * Consider deprecating this function when the <phoneme> tag of the speech reader is used correctly by speech synthesizers.
 * @param msg The message in which to change text to be more pronounce-able.
 */
function pronunciationHint(msg) {
	try {
    msg = msg.replace(/\bprintln\b/gi, "print line");
	msg = msg.replace(/\btoString\b/g, "two string");
    msg = msg.replace(/\bdeque\b/gi, "deck");
    msg = msg.replace(/\bdequeue\b/gi, "dee-queue");
    msg = msg.replace(/\benqueue\b/gi, "in-queue");
    msg = msg.replace(/\bLIFO\b/g, "lie foe");
    msg = msg.replace(/\bFIFO\b/g, "fie foe");
    msg = msg.replace(/O\(1\)/gi, "O of 1");
    msg = msg.replace(/O\(log\(n\)\)/gi, "O of log of n");
    msg = msg.replace(/O\(n\)/gi, "O of n");
    msg = msg.replace(/O\(n\^2\)/gi, "O of n squared");
    msg = msg.replace(/O\(n\^3\)/gi, "O of n cubed");
    msg = msg.replace(/O\(n\^4\)/gi, "O of n to the fourth");
    msg = msg.replace(/O\(n\^5\)/gi, "O of n to the fifth");
    msg = msg.replace(/O\(n\!\)/gi, "O of n factorial");
    msg = msg.replace(/O\(n\^n\)/gi, "O of n to the power of n");
	} catch (err) {
		
	} finally {
		return msg;
	}
}