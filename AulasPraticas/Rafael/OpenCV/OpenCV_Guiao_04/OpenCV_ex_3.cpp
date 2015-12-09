#include <iostream>


#include "opencv2/core/core.hpp"

#include "opencv2/imgproc/imgproc.hpp"

#include "opencv2/highgui/highgui.hpp"


using namespace cv;

using namespace std;


// FUNCOES AUXILIARES

void printImageFeatures( const Mat &imagem )
{
    cout << endl;

    cout << "Numero de linhas : " << imagem.size().height << endl;

    cout << "Numero de colunas : " << imagem.size().width << endl;

    cout << "Numero de canais : " << imagem.channels() << endl;

    cout << "Numero de bytes por pixel : " << imagem.elemSize() << endl;

    cout << endl;
}


// MAIN

int main( int argc, char** argv )
{
    if( argc != 2)
    {
        cout <<"Falta o nome do ficheiro da imagem !!" << endl;

        return -1;
    }

	Mat imagemOriginal;

	imagemOriginal = imread( argv[1], CV_LOAD_IMAGE_UNCHANGED );

	if( ! imagemOriginal.data )
	{
	    // Leitura SEM SUCESSO

	    cout << "Ficheiro nao foi aberto ou localizado !!" << endl;

	    return -1;
	}

	if( imagemOriginal.channels() > 1 )
	{
	    // Converter para 1 so canal !!

	    cvtColor( imagemOriginal, imagemOriginal, CV_BGR2GRAY, 1 );
	}

    // Janela

    namedWindow( "Imagem Original", CV_WINDOW_AUTOSIZE );

    // Visualizar

    imshow( "Imagem Original", imagemOriginal );

    // Imprimir alguma informacao

    cout << "IMAGEM ORIGINAL" << endl;

    printImageFeatures( imagemOriginal );

    // binary threshold

    Mat thresholdFMediaBinary;

    namedWindow( "Binary image", CV_WINDOW_AUTOSIZE );

    imshow( "Binrary image", imagemOriginal );

    // dilate

    Mat dilateImg_33;
    Mat dilateImg_1111;

    Mat element11_11 = getStructuringElement(MORPH_ELLIPSE, Size(11, 11));
    Mat element3_3 = getStructuringElement(MORPH_ELLIPSE, Size(3, 3));

    dilate(imagemOriginal, dilateImg_1111, element11_11);
    dilate(imagemOriginal, dilateImg_33, element3_3);

    namedWindow( "dilate 3 3", CV_WINDOW_AUTOSIZE );
    imshow( "dilate 3 3", dilateImg_33 );

    namedWindow( "dilate 11 11", CV_WINDOW_AUTOSIZE );
    imshow( "dilate 11 11 ", dilateImg_1111 );
    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}
