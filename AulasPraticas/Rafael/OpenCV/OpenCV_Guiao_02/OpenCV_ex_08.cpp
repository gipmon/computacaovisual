/*
 * OpenCV_ex_08.cpp
 *
 * Criar e visualizar o histograma
 *
 * Fornecer alguma informacao estatistica
 *
 * SUGESTAO : Subdividir em FUNCOES AUXILIARES
 *
 * J. Madeira - Dez/2012
 */


#include <iostream>


#include "opencv2/core/core.hpp"

#include "opencv2/imgproc/imgproc.hpp"

#include "opencv2/highgui/highgui.hpp"


using namespace cv;

using namespace std;


int main( int argc, char** argv )
{
    if( argc != 2)
    {
        cout <<"Falta o nome do ficheiro da imagem !!" << endl;

        return -1;
    }

	Mat imagem;

	imagem = imread( argv[1], CV_LOAD_IMAGE_UNCHANGED );

	if( ! imagem.data )
	{
	    // Leitura SEM SUCESSO

	    cout << "Ficheiro nao foi aberto ou localizado !!" << endl;

	    return -1;
	}

	if( imagem.channels() > 1 )
	{
	    cout << "A imagem carregada tem mais do que UM CANAL !!" << endl;

	    return -1;
	}

    // Janela

    namedWindow( "Imagem Original", CV_WINDOW_AUTOSIZE );

    // Visualizar

    imshow( "Imagem Original", imagem );

    // Imprimir alguma informacao

    cout << endl;

    cout << "IMAGEM ORIGINAL" << endl;

    cout << "Numero de linhas : " << imagem.size().height << endl;

    cout << "Numero de colunas : " << imagem.size().width << endl;

    cout << "Numero de canais : " << imagem.channels() << endl;

    cout << "Numero de bytes por pixel : " << imagem.elemSize() << endl;

    cout << endl;

    // HISTOGRAMA

    // Caracteristicas do histograma

    int numImages = 1;

    const int* channels = { 0 };

    // Dimensao

    int dim = 1;

    // Tamanho

    int histSize = 256;     // De 0 a 255

    // Intervalo de intensidades

    float range[] = { 0, 256 };     // Limite superior e EXCLUSIVO !!

    const float* histRange = { range };

    // Histograma uniforme

    bool uniform = true;

    // Nao ha acumulacao de dados de varias imagens

    bool accumulate = false;

    // Calcular o histograma

    Mat histograma;

    calcHist( &imagem, numImages, channels, Mat(),

              histograma, dim, &histSize, &histRange, uniform, accumulate );

    // Propriedades da imagem original

    // MIN and MAX values and their indices

    double minValue, maxValue;

    int minIndex, maxIndex;

    minMaxIdx( histograma, &minValue, &maxValue, &minIndex, &maxIndex );

    cout << "Menor numero de pixels : " << minValue << " - Para o nivel de cinzento : " << minIndex << endl;

    cout << "Maior numero de pixels : " << maxValue << " - Para o nivel de cinzento : " << maxIndex << endl;

    // MEAN and STANDARD DEVIATION

    vector<double> meanValue;

    vector<double> stdDev;

    meanStdDev( histograma, meanValue, stdDev );

    cout << "Valor medio : " << meanValue[0] << endl;

    cout << "Desvio padrao : " << stdDev[0] << endl;

    // Criar uma imagem para representar o histograma

    int histImageWidth = 512;

    int histImageHeight = 512;

    Scalar backgroundIsWhite( 255 );

    Mat histImage( histImageHeight, histImageWidth, CV_8UC1, backgroundIsWhite );

    // Desenhar o histograma

    // A largura de cada barra

    int binWidth = (int) ((float) histImageWidth / histSize + 0.5f);

    // Normalizar os valores para [ 0, histImageHeight ]

    Mat histNormalizado;

    normalize( histograma, histNormalizado, 0, histImageHeight, NORM_MINMAX );

    // Desenhar as barras do histograma normalizado

    // ATENCAO : ccordenada Y !!

    for(int i = 0; i < histSize; ++i )
    {
        rectangle( histImage,
                   Point( i * binWidth, histImageHeight ),
                   Point( ( i + 1 ) * binWidth, histImageHeight - (int) (histNormalizado.at<float>(i))),
                   Scalar( 0 ), CV_FILLED );
    }

    // Visualizar o histograma

    namedWindow( "Histograma", CV_WINDOW_AUTOSIZE );

    imshow( "Histograma", histImage );

    double minGreyValue, maxGrayValue;

    minMaxLoc(imagem, &minGreyValue, &maxGrayValue);

    double factor = 255.0 / (maxGrayValue - minGreyValue);

    Mat imagemCS = Mat(imagem.size(), CV_8UC1);

    for(int row=0; row<imagemCS.size().height; ++row){
        for(int col=0; col<imagemCS.size().width; ++col){
            imagemCS.at<unsigned char>(row, col) = (int) ((imagem.at<unsigned char>(row, col) - minGreyValue) * factor);
        }
    }


    namedWindow( "CS", CV_WINDOW_AUTOSIZE );

    imshow( "CS", imagemCS );
    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}
