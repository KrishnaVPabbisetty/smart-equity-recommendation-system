import sqlite3

# Connect to your database
conn = sqlite3.connect('test.db')
cursor = conn.cursor()

# Delete a document with a specific ID
doc_id = 1  # the ID of the document you want to delete
cursor.execute('DELETE FROM documents WHERE id = ?', (doc_id,))

# Save (commit) the changes
conn.commit()

# Close the connection
conn.close()
