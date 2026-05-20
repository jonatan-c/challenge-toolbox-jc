import { useState, useEffect } from 'react'
import { Container, Navbar, Table, Spinner, Alert, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [fileList, setFileList] = useState([])
  const [selectedFile, setSelectedFile] = useState('')

  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/files/list')
      .then((res) => res.json())
      .then((data) => setFileList(data.files || []))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)

    const url = selectedFile ? `/files/data?fileName=${selectedFile}` : '/files/data'

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then((data) => setFiles(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedFile])

  return (
    <>
      <Navbar bg="danger" variant="dark">
        <Container>
          <Navbar.Brand>React Test App</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Form.Select
          className="mb-3"
          style={{ maxWidth: 250 }}
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          <option value="">All files</option>
          {fileList.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Form.Select>

        {loading && (
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Loading...</span>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Table bordered hover>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Text</th>
                <th>Number</th>
                <th>Hex</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) =>
                file.lines.map((line, i) => (
                  <tr key={`${file.file}-${i}`}>
                    <td>{file.file}</td>
                    <td>{line.text}</td>
                    <td>{line.number}</td>
                    <td>{line.hex}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  )
}

export default App
