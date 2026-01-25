import registrationService from "@/services/registrationService";

type GenerateStudentCodeResult = {
  studentCode: string;
  courseInitials: string;
  sequentialNumber: string;
  year: number;
};

export async function generateStudentCode(
  courseCode: string,
  courseName: string
): Promise<string> {
  try {
    const courseInitials = courseName
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase())
      .join("")
      .substring(0, 4);

    const { next_number } = await registrationService.getCountByCourse(courseCode);

    const sequentialNumber = String(next_number).padStart(4, "0");
    const year = new Date().getFullYear();

    // ✅ retorna string
    return `${courseInitials}.${sequentialNumber}.${year}`;
  } catch (error) {
    console.error("Erro ao gerar código do estudante:", error);
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
    return `EST.${random}.${year}`;
  }
}
