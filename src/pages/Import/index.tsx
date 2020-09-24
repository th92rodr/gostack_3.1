import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import api from '../../services/api';

import alert from '../../assets/alert.svg';

import { Container, Title, ImportFileContainer, Footer } from './styles';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    uploadedFiles.forEach(uploadedFile => {
      data.append('file', uploadedFile.file);
    });

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (error) {
      console.log(error.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const uploadedFilesProps: FileProps[] = files.map(file => ({
      file,
      name: file.name,
      readableSize: String(file.size),
    }));

    setUploadedFiles(uploadedFilesProps);
  }

  return (
    <>
      <Header size='small' />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt='Alert' />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type='button'>
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
