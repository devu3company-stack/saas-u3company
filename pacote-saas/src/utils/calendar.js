// Exporta função para criar link compatível com Google Calendar e enviar notificação

export const createGoogleCalendarUrl = (title, details, location, startDate, endDate) => {
    // Formata a data para o padrão do Google Calendar (YYYYMMDDTHHMMSSZ)
    // Se quiser fuso horário local, omite o Z, ex: 20260222T140000 

    const formatDate = (dateString, timeString) => {
        // mock format - para prod usar library tipo date-fns
        const dateParts = dateString.split('-'); // ex: 2026-02-22
        const timeParts = timeString.split(':'); // ex: 14:00

        return `${dateParts[0]}${dateParts[1]}${dateParts[2]}T${timeParts[0]}${timeParts[1]}00`;
    };

    const start = formatDate(startDate.date, startDate.time);
    const end = formatDate(endDate.date, endDate.time);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        details: details,
        location: location,
        dates: `${start}/${end}`
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
