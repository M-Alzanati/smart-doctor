import cv2
import numpy as np


class ImageUtility:
    def __init__(self, img):
        self.img = img

    # get grayscale image
    def get_grayscale(self):
        return cv2.cvtColor(self.img, cv2.COLOR_BGR2GRAY)

    # noise removal
    def remove_noise(self):
        return cv2.medianBlur(self.img, 5)

    # thresholding
    def thresholding(self):
        return cv2.threshold(self.img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    # dilation
    def dilate(self):
        kernel = np.ones((5, 5), np.uint8)
        return cv2.dilate(self, kernel, iterations=1)

    # erosion
    def erode(self):
        kernel = np.ones((5, 5), np.uint8)
        return cv2.erode(self.img, kernel, iterations=1)

    # opening - erosion followed by dilation
    def opening(self):
        kernel = np.ones((5, 5), np.uint8)
        return cv2.morphologyEx(self.img, cv2.MORPH_OPEN, kernel)

    # canny edge detection
    def canny(self):
        return cv2.Canny(self.img, 100, 200)

    # skew correction
    def deskew(self):
        coords = np.column_stack(np.where(self.img > 0))
        angle = cv2.minAreaRect(coords)[-1]

        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        (h, w) = self.img.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(self.img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated

    # template matching
    def match_template(self, template):
        return cv2.matchTemplate(self.img, template, cv2.TM_CCOEFF_NORMED)